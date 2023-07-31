import { MdClose } from "react-icons/md"
import { BsCartX } from "react-icons/bs"

import "./Cart.scss";
import CartItem from "./CartItem/CartItem";
import { useContext } from "react";
import { Context } from "../../utils/context";
import {loadStripe} from '@stripe/stripe-js';
import { makePaymentRequest } from "../../utils/api";

const Cart = ({ setShowCart }) => {
    const { cartSubTotal, cartItem } = useContext(Context);

    const handlePayment = async () => {
        const stripePromise =  await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

        try {
            const stripe = await stripePromise;
            const res = await makePaymentRequest.post("/api/orders", {
                products: cartItem,
            });
            await stripe.redirectToCheckout({
                sessionId: res.data.stripeSession.id
            })
        } catch (err) {
            console.log(err);
        }

    }

    return <div className="cart-panel">
        <div className="opac-layer"></div>
        <div className="cart-content">
            <div className="cart-header">
                <span className="heading">
                    Shopping Cart
                </span>
                <span className="close-btn"
                    onClick={() => setShowCart(false)}>
                    <MdClose />
                    <span className="text">Close</span>
                </span>
            </div>

            {!cartItem?.length && <div className="empty-cart">
                <BsCartX />
                <span>No Product in the cart.</span>
                <button className="return-cta">
                    RETURN TO SHOP
                </button>
            </div>}
            {!!cartItem?.length && <>
                <CartItem />
                <div className="cart-footer">
                    <div className="subtotal">
                        <span className="text">Subtotal:</span>
                        <span className="text total"> &#8377;{cartSubTotal}</span>
                    </div>
                    <div className="button">
                        <button className="checkout-cta" onClick={handlePayment}>Checkout</button>
                    </div>
                </div>
            </>}

        </div>
    </div>;
};

export default Cart;
