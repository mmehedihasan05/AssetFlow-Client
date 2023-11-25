import SectionTitle from "../../Components/SectionTitle";

const About = () => {
    return (
        <div className="custom-width bg-white space-y-4">
            <SectionTitle data={{ title: "About Us" }}></SectionTitle>
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                    Welcome to AssetFlow, where innovation meets efficiency. In this groundbreaking
                    project, we are developing a web application designed to revolutionize asset and
                    product management for businesses. Our vision is to empower companies, large or
                    small, with a seamless solution that streamlines the complexities of asset
                    tracking.
                    <br />
                    <br />
                    By offering a subscription-based service, any company can leverage our web app
                    to effortlessly manage their assets and products. The core objective of this
                    software is to provide HR with a user-friendly interface, enabling them to
                    monitor how employees interact with company assets. These assets are categorized
                    into two types: Returnable items, such as laptops, keyboards, chairs, and cell
                    phones, and Non-returnable items, including pens, pencils, paper, diaries, and
                    tissue paper.
                    <br />
                    <br />
                    At AssetFlow, we believe in simplifying the intricate processes of asset
                    management, fostering organizational efficiency, and enhancing the overall
                    productivity of businesses. Join us on this journey as we redefine the way
                    companies manage their resources, one subscription at a time.
                </div>
                <div className="col-span-2">
                    <img src="/about_us.jpg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default About;
