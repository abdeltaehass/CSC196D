import Carousel from "./components/Carousel";
import About from "./components/About";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";

export default function Home() {
  return (
  <div className="w-full flex flex-col pt-14">
     <Carousel />
     <About/>
     <Certificates/>
     <Contact/>
  </div>
  );
}
