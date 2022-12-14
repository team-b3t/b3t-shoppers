import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

import Cart from "./Cart";

function handleCart() {
  const cartBlock = document.getElementById("cart_block");
  if (cartBlock.classList.contains("hide_block")) {
    cartBlock.classList.remove("hide_block");
    cartBlock.classList.add("show_block");
  } else {
    cartBlock.classList.add("fade_out");
    setTimeout(() => {
      cartBlock.classList.remove("show_block");
      cartBlock.classList.add("hide_block");
      cartBlock.classList.remove("fade_out");
    }, 900);
  }
}

const Navbar = ({ handleClick, isLoggedIn, auth, order }) => {
  let prices;

  if (isLoggedIn && order.products) {
    prices = order.products.map(
      (el) => el.order_products.price * el.order_products.quantity
    );
  } else {
    prices = order.guestCart.map(
      (el) => el.price * Number(localStorage.getItem(el.id))
    );
  }

  const cartSum = prices.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );

  return (
    <div>
      <div id="store_name">
        <img src="/images/logo.png" />
        <h1>Nook's Cranny</h1>
      </div>
      <nav>
        {isLoggedIn ? (
          <div id="nav_bar">
            {/* The navbar will show these links after you log in */}
            <div>
              <div className="nonprod_button">
                <Link to="/">Home</Link>
              </div>
              <div className="product_buttons">
                <Link to="/products">All</Link>
                <Link to="/food">Food</Link>
                <Link to="/indoors">Indoors</Link>
                <Link to="/outdoors">Outdoors</Link>
                <Link to="/others">Others</Link>
              </div>
            </div>
            <div className="nonprod_button">
              <div>
                <button
                  type="button"
                  className="cart_button"
                  onClick={() => handleCart()}
                >
                  <img
                    src="/images/Menu_Nook_Shopping_NH_Icon.png"
                    className="cart_img"
                  />
                  <p>({order.products ? order.products.length : 0})</p>
                </button>
              </div>
              {auth.isAdmin ? (
                <Link to="/myAdminAccount">My Account</Link>
              ) : (
                <Link to="/myAccount">My Account</Link>
              )}
              <a href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
          </div>
        ) : (
          <div id="nav_bar">
            {/* The navbar will show these links before you log in */}
            <div>
              <div className="nonprod_button">
                <Link to="/">Home</Link>
              </div>
              <div className="product_buttons">
                <Link to="/products">All</Link>
                <Link to="/food">Food</Link>
                <Link to="/indoors">Indoors</Link>
                <Link to="/outdoors">Outdoors</Link>
                <Link to="/others">Others</Link>
              </div>
            </div>
            <div className="nonprod_button">
              <div className="cart_button">
                <button
                  type="button"
                  className="cart_button"
                  onClick={() => handleCart()}
                >
                  <img
                    src="/images/Menu_Nook_Shopping_NH_Icon.png"
                    className="cart_img"
                  />
                  <p>({order.guestCart.length})</p>
                </button>
              </div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>
      <div id="cart_block" className="hide_block">
        <div id="cart_view">
          <div id="inner_cart_view">
            <div id="cart_text">
              <h2>YOUR CART: </h2>
              <button type="button" onClick={() => handleCart()}>
                X
              </button>
            </div>
            <p>${cartSum}</p>
            <div className="cart_products">
              <Cart />
            </div>
            <div id="checkout_cart">
              <div id="checkout_button">
                <Link to="/checkout" onClick={() => handleCart()}>
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div id="behind_cart" onClick={() => handleCart()} />
      </div>
    </div>
  );
};
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    auth: state.auth,
    order: state.currentOrder,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
