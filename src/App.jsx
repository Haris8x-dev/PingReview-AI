import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import ProductReviewChat from "./pages/ProductReviewChat"
import FeaturesSection from "./pages/FeaturesSection"
import AboutSection from "./pages/AboutSection"
import VsComparison from "./pages/VsComparision"
import ProductSpecification from "./pages/ProductSpecification"
import Contact from "./pages/Contact"
import Login from "./pages/Login"

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chat",
      element: <ProductReviewChat />,
    },
    {
      path: "/features",
      element: <FeaturesSection />,
    },
    {
      path: "/about",
      element: <AboutSection />,
    },
    {
      path: "/vs-comparision",
      element: <VsComparison />,
    },
    {
      path: "/product-specification",
      element: <ProductSpecification />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/login",
      element: <Login />,
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App
