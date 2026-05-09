const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountDAO = require('../dao/AccountDAO');
const crypto = require('crypto');

const otpStore = new Map(); // In-memory store for OTPs { username: { otp, expiresAt } }

const JWT_SECRET = process.env.JWT_SECRET || 'homestay_dorm_super_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthBUS {
    async login(email, password) {
        if (!email || !password) {
            const err = new Error('Email và mật khẩu là bắt buộc');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        const account = await accountDAO.findByEmail(email);
        if (!account) {
            const err = new Error('Email hoặc mật khẩu không đúng');
            err.type = 'business';
            err.status = 401;
            throw err;
        }

        const isPasswordValid = await bcrypt.compare(password, account.password_hash);
        if (!isPasswordValid) {
            const err = new Error('Email hoặc mật khẩu không đúng');
            err.type = 'business';
            err.status = 401;
            throw err;
        }

        // Nếu là customer nhưng chưa có tenant → tự tạo và link
        let tenantId = account.tenant_id || null;
        if (account.role === 'customer' && !tenantId) {
            const tenantDAO = require('../dao/TenantDAO');
            const tenant = await tenantDAO.create({
                name: account.username || account.email.split('@')[0],
                nationality: 'Vietnam'
            });
            await accountDAO.update(account.account_id, { tenant_id: tenant.tenant_id });
            tenantId = tenant.tenant_id;
        }

        const payload = {
            account_id: account.account_id,
            username: account.username,
            role: account.role,
            employee_id: account.employee_id || null,
            tenant_id: tenantId
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return {
            token,
            user: {
                account_id: account.account_id,
                username: account.username,
                role: account.role,
                employee: account.employee || null,
                tenant: account.tenant || null
            }
        };
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (err) {
            const error = new Error('Token không hợp lệ hoặc đã hết hạn');
            error.type = 'unauthorized';
            error.status = 401;
            throw error;
        }
    }

    async getMe(accountId) {
        let account = await accountDAO.findByIdWithRelations(accountId);
        if (!account) {
            const err = new Error('Tài khoản không tồn tại');
            err.type = 'business';
            err.status = 404;
            throw err;
        }


        if (isNaN(account.tenant?.tenant_id)) {
            const tenantDAO = require('../dao/TenantDAO');
            const tenant = await tenantDAO.create({ name: account.username, nationality: 'Vietnam' });
            await accountDAO.update(account.account_id, { tenant_id: tenant.tenant_id });
            account = await accountDAO.findByIdWithRelations(accountId);
        }

        return account;
    }

    async updateProfile(accountId, updates) {
        let account = await accountDAO.findByIdWithRelations(accountId);
        if (!account) {
            const err = new Error('Tài khoản không tồn tại');
            err.type = 'business';
            err.status = 404;
            throw err;
        }

        let targetTenantId = account.tenant?.tenant_id;

        // If the account doesn't have a tenant record yet, create one so they can have a profile
        if (!targetTenantId) {
            const tenantDAO = require('../dao/TenantDAO');
            const newTenant = await tenantDAO.create({
                name: updates.name || account.username,
                nationality: updates.nationality || 'Vietnam'
            });
            await accountDAO.update(account.account_id, { tenant_id: newTenant.tenant_id });
            targetTenantId = newTenant.tenant_id;
        }

        const tenantDAO = require('../dao/TenantDAO');
        const tenantUpdates = {
            name: updates.name,
            phone: updates.phone,
            gender: updates.gender,
            nationality: updates.nationality,
            cccd_number: updates.cccd_number
        };

        const accountUpdates = {
            username: updates.username,
            email: updates.email
        };

        // Remove undefined fields
        Object.keys(tenantUpdates).forEach(key => tenantUpdates[key] === undefined && delete tenantUpdates[key]);
        Object.keys(accountUpdates).forEach(key => accountUpdates[key] === undefined && delete accountUpdates[key]);

        if (Object.keys(tenantUpdates).length > 0) {
            await tenantDAO.update(targetTenantId, tenantUpdates);
        }

        if (Object.keys(accountUpdates).length > 0) {
            await accountDAO.update(accountId, accountUpdates);
        }

        return this.getMe(accountId);
    }

    async register({ email, password, role, employeeId, tenantId }) {
        let finalTenantId = tenantId;

        if (role === 'customer' && !finalTenantId) {
            const tenantDAO = require('../dao/TenantDAO');
            const tenant = await tenantDAO.create({
                name: email.split('@')[0], // Default name from email prefix
                nationality: 'Vietnam'
            });
            finalTenantId = tenant.tenant_id;
        }

        const SALT_ROUNDS = 10;
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        return accountDAO.createAccount({
            username: email, // Keep username as email
            email,
            passwordHash,
            role,
            employeeId,
            tenantId: finalTenantId
        });
    }

    async registerCustomer({ email, password }) {
        // Automatically assign 'customer' role
        return this.register({ email, password, role: 'customer' });
    }

    async forgotPassword(email) {
        if (!email) {
            const err = new Error('Vui lòng nhập email');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        const account = await accountDAO.findByEmail(email);
        if (!account) {
            const err = new Error('Tài khoản không tồn tại');
            err.type = 'business';
            err.status = 404;
            throw err;
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

        otpStore.set(email, { otp, expiresAt });

        // Generate an email template string
        const emailTemplate = `
            <h2>Xin chào ${email},</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là: <strong>${otp}</strong></p>
            <p>Mã này sẽ hết hạn trong 15 phút.</p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        `;

        // In a real app, send the email here.
        // For now, we will return the template in the response so the frontend can mock or display it.
        return {
            message: 'OTP đã được gửi (Mock)',
            otp, // Only returning this for demo/testing purposes
            emailTemplate
        };
    }

    async resetPassword(email, otp, newPassword) {
        if (!email || !otp || !newPassword) {
            const err = new Error('Thông tin không đầy đủ');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        const storeData = otpStore.get(email);
        if (!storeData) {
            const err = new Error('Không tìm thấy yêu cầu OTP hoặc OTP đã hết hạn');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        if (storeData.otp !== otp) {
            const err = new Error('Mã OTP không chính xác');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        if (Date.now() > storeData.expiresAt) {
            otpStore.delete(email);
            const err = new Error('Mã OTP đã hết hạn');
            err.type = 'business';
            err.status = 400;
            throw err;
        }

        // OTP is valid
        const SALT_ROUNDS = 10;
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await accountDAO.updatePasswordByEmail(email, passwordHash);

        // Clear OTP
        otpStore.delete(email);

        return { message: 'Đổi mật khẩu thành công' };
    }
}

module.exports = new AuthBUS();
