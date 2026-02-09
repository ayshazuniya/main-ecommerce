import Navbar from "./Navbar";
import Newsletter from "./Newsletter";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Newsletter />
      <Footer />
    </>
  );
}
