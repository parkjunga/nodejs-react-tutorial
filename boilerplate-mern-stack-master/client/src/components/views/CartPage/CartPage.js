import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {

       const dispatch = useDispatch();
    useEffect(()=>{

        let cartItems = []
        console.log(props, '가장첨??');
        console.log(cartItems);
        //리덕스 User state안에 cart안에 상품이 들어 있는 지 먼저 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    console.log("item",item);
                    cartItems.push(item.id)
                })

                // axious 대신 리덕스
                dispatch(getCartItems(cartItems, props.user.userData.cart)) // action을 넣어줌
            }
        }

    }, [props.user.userData])

    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <h1>My cart</h1>
            <div>
                <UserCardBlock products={props.user.cartDetail}/>
            </div>
        </div>

    )
}

export default CartPage