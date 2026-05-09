import TextIconButton from "@/layouts/TextIconButton";

import facebookIcon from "@/assets/icons/Facebook.svg";

const FacebookButton = () => {
    return (
        <TextIconButton 
            icon={facebookIcon}
            text="Facebook"
            className="flex h-10 w-50 items-center justify-center gap-3 rounded-full border border-DarktOutline transition-colors hover:bg-gray-50 active:scale-[0.98]"
        />
    )
}

export default FacebookButton;
