import About from "./Pages/Home/About";
import Banner from "./Pages/Home/Banner";
import Packages from "./Pages/Home/Packages";

const Home = () => {
    return (
        <div className="space-y-8">
            <Banner></Banner>
            <About></About>
            <Packages></Packages>
        </div>
    );
};

export default Home;
