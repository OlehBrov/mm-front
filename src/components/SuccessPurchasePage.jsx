import { Link } from "react-router-dom"

export const SuccessPurchasePage = () => {
  return (
      <div className="container">
          <h1>Thank you for your purchase</h1>
          <Link to={"/products"} className="cart-button">Go to Home Page</Link>
    </div>
  )
}

