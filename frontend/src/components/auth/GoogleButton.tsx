import TextIconButton from "@/layouts/TextIconButton";

import googleIcon from "@/assets/icons/Google.svg";

const GoogleButton = () => {
    return (
        <TextIconButton 
            icon={googleIcon}
            text="Google"
            className="flex h-10 w-50 items-center justify-center gap-3 rounded-full border border-DarktOutline transition-colors hover:bg-gray-50 active:scale-[0.98]"
        />
    )
}

export default GoogleButton;
