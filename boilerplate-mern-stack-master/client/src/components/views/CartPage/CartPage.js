import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItemts } from '../../../_actions/user_actions';

function CartPage(props) {

    const dispatch = useDispatch();

    useRffect(()=>{

        let cartItems = []

        //리덕스 User state안에 cart안에 상품이 들어 있는 지 먼저 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEacth(item => {
                    cartItems.push(item.id)
                })

                // axious 대신 리덕스
                dispatch(getCartItemts(cartItems, props.user.userData.cart)) // action을 넣어줌
            }
        }

    }, [])

    return (
        <div>
            CartPage
        </div>

    )
}

export default CartPage