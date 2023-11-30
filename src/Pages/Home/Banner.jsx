// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../CssStyles/Banner.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className="banner_ custom-width">
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                grabCursor={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                navigation={true}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper rounded-lg"
            >
                <div>
                    <SwiperSlide>
                        <div
                            className="min-h-[100%] w-full banner-image-container"
                            style={{
                                backgroundImage: `url(/banner_hr.jpg)`,
                            }}
                        >
                            <div className="banner-image-overlay"></div>
                            <div
                                className="min-h-[100%] max-w-100% md:max-w-[60%] lg:max-w-[40%]  absolute 
                                flex items-center justify-start "
                            >
                                <div className="pl-4 md:pl-16">
                                    <h1 className="mb-5 text-3xl md:text-5xl font-bold text-[#00264c] ">
                                        Join as HR
                                    </h1>
                                    <p className="mb-5 text-xl text-[#013568] hidden md:block">
                                        Shape the future of your organization. Join as an HR
                                        professional and play a crucial role in building a vibrant
                                        and inclusive workplace.
                                    </p>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate("/register_hr")}
                                    >
                                        Join As HR
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="min-h-[100%] w-full banner-image-container"
                            style={{
                                backgroundImage: `url(/banner_employee.jpg)`,
                            }}
                        >
                            <div className="banner-image-overlay"></div>
                            <div
                                className="min-h-[100%] max-w-100% md:max-w-[60%] lg:max-w-[40%]  absolute 
                                flex items-center justify-start "
                            >
                                <div className="pl-4 md:pl-16">
                                    <h1 className="mb-5 text-3xl md:text-5xl font-bold text-[#00264c] ">
                                        Join as Employee
                                    </h1>
                                    <p className="mb-5 text-xl text-[#013568]  hidden md:block">
                                        Unlock opportunities and be a part of our dynamic team. Join
                                        to contribute your skills and grow together.
                                    </p>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate("/register_employee")}
                                    >
                                        Join As Employee
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </div>
            </Swiper>
        </div>
    );
};

export default Banner;
