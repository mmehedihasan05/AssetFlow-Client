/* eslint-disable react/jsx-no-target-blank */
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
const Footer = () => {
    return (
        <div className="border flex justify-between items-center px-6 py-1">
            <div>
                <img src="/Logo-bg-blue.png" className="w-[140px]" alt="" />
                <p className=""> Empower Your Workplace.</p>
            </div>
            <div className="flex gap-4">
                <a href="https://twitter.com/" target="_blank">
                    <TwitterIcon />
                </a>
                <a href="https://www.facebook.com/" target="_blank">
                    <FacebookOutlinedIcon />
                </a>
                <a href="https://www.youtube.com/" target="_blank">
                    <YouTubeIcon />
                </a>
            </div>
        </div>
    );
};

export default Footer;
