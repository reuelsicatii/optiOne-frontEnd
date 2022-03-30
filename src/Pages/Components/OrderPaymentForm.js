import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../Assets/css/OrderPaymentForm.css'
import withRouter from './WithRouter'


function OrderPaymentForm(props) {

    useEffect(() => {


        retrievePaymentOptions();
        retrievePackage();

    }, []);

    // Packages, Delivery and Option States
    // =================================================
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [membershipPackageDetails, setMembershipPackageDetails] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [orderCode, setOrderCode] = useState("ToBeDetermine");
    const [deliveryOption, setDeliveryOption] = useState("ToBeDetermine");
    const [deliveryFee, setDeliveryFee] = useState("0.00");
    const [paymentOption, setPaymentOption] = useState("ToBeDetermine");
    const [paymentFee, setPaymentFee] = useState("0.00");
    const [filePath, setFilePath] = useState();
    const [packageID, setPackageID] = useState();
    const [checkOutURL, setCheckOutURL] = useState();
    const navigate = useNavigate();


    async function retrievePaymentOptions() {
        let requestPaymentOptions = {
            method: 'GET',
            url: process.env.REACT_APP_BACKENDURL + '/api/listPaymentOptions',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        }

        let responsePaymentOptions = await axios(requestPaymentOptions);
        setPaymentOptions(responsePaymentOptions.data);
    }

    async function retrievePackage() {
        let requestOrderPackage = {
            method: 'GET',
            url: process.env.REACT_APP_BACKENDURL + '/api/getPackage/' + props.router.params.order_code,
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        }

        let responseOrderPackage = await axios(requestOrderPackage);

        // Order Package Object
        // ================================
        setPackageID(responseOrderPackage.data[0].id);
        setOrderStatus(responseOrderPackage.data[0].order_status);
        setDeliveryOption(responseOrderPackage.data[0].delivery_option);
        setDeliveryFee(responseOrderPackage.data[0].delivery_fee);
        setOrderCode(responseOrderPackage.data[0].order_code);

        responseOrderPackage.data[0].order_code.length == 15
            ? setMembershipPackageDetails(JSON.parse(responseOrderPackage.data[0].membership_package))
            : setProductDetails(JSON.parse(responseOrderPackage.data[0].order_product));
    }

    // function updatePaymentOption(e) {
    //     const [paymentOptionTemp, paymentFeeTemp] = (e.target.value).split(",");
    //     setPaymentOption(paymentOptionTemp);
    //     setPaymentFee(paymentFeeTemp);
    //     orderCode.length == 15 ? updatePackage() : updateProduct();

    // }

    async function updatePackage(paymentOptionTemp, paymentFeeTemp) {

        let formData = new FormData();
        formData.append('id', packageID);
        formData.append('order_code', orderCode);
        formData.append('payment_option', paymentOptionTemp);
        formData.append('payment_fee', paymentFeeTemp);
        formData.append('file_path', filePath);
        formData.append('total', membershipPackageDetails.length == 0 ?
            (deliveryFee * 1) + (paymentFee * 1) :
            (membershipPackageDetails
                .map(membershipPackageDetail => membershipPackageDetail.subTotal)
                .reduce((prev, next) => prev + next)
                + (deliveryFee * 1) + (paymentFee * 1)));

        let requestUpdatePackage = {
            method: 'POST',
            url: process.env.REACT_APP_BACKENDURL + '/api/updatePackage',
            headers: {
                "Content-Type": 'multipart/form-data',
                "Accept": 'application/json'
            },
            data: formData
        }

        let responseUpdatePackage = await axios(requestUpdatePackage);
        setCheckOutURL(responseUpdatePackage.data[1].checkout_url);

    }

    async function updateProduct(paymentOptionTemp, paymentFeeTemp) {

        let formData = new FormData();
        formData.append('id', packageID);
        formData.append('order_code', orderCode);
        formData.append('payment_option', paymentOptionTemp);
        formData.append('payment_fee', paymentFeeTemp);
        formData.append('file_path', filePath);
        formData.append('total', productDetails.length == 0 ?
            (deliveryFee * 1) + (paymentFee * 1) :
            (productDetails
                .map(productDetail => productDetail.subTotal)
                .reduce((prev, next) => prev + next)
                + (deliveryFee * 1) + (paymentFee * 1)));

        let requestUpdateProduct = {
            method: 'POST',
            url: process.env.REACT_APP_BACKENDURL + '/api/updateProduct',
            headers: {
                "Content-Type": 'multipart/form-data',
                "Accept": 'application/json'
            },
            data: formData
        }

        let responseUpdateProduct = await axios(requestUpdateProduct);
        setCheckOutURL(responseUpdateProduct.data[1].checkout_url);

    }

    function orderStatusRender() {

        switch (orderStatus) {
            case 'Order Payment':
                return (
                    <>
                        <div className="steps-active">Order Placed</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Payment</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Payment Validation</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Order Sent</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Order Delivered</div>
                    </>
                )
            case 'Payment Validation':
                return (
                    <>
                        <div className="steps-active">Order Placed</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Payment</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Payment Validation</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Order Sent</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Order Delivered</div>
                    </>
                )
            case 'Order Sent':
                return (
                    <>
                        <div className="steps-active">Order Placed</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Payment</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Payment Validation</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Sent</div>
                        <span className="line-notActive"></span>
                        <div className="steps-notActive">Order Delivered</div>
                    </>
                )

            case 'Order Delivered':
                return (
                    <>
                        <div className="steps-active">Order Placed</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Payment</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Payment Validation</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Sent</div>
                        <span className="line-active"></span>
                        <div className="steps-active">Order Delivered</div>
                    </>
                )
        }

    }

    function OrderSummaryRender() {
        return (

            orderCode.length == 15
                ?
                membershipPackageDetails.map((membershipPackageDetail, index) =>
                    <tr key={index}>
                        <td className="align-middle">{membershipPackageDetail.package}</td>
                        <td className="align-middle">{(membershipPackageDetail.price * 1).toFixed(2)}</td>
                        <td className="align-middle">{membershipPackageDetail.quantity}</td>
                        <td className="align-middle">{membershipPackageDetail.subTotal == "" ? "" : (membershipPackageDetail.subTotal * 1).toFixed(2)}</td>
                    </tr>
                )
                :
                productDetails.map((productDetail, index) =>
                    <tr key={index}>
                        <td className="align-middle">{productDetail.product}</td>
                        <td className="align-middle">{(productDetail.price * 1).toFixed(2)}</td>
                        <td className="align-middle">{productDetail.quantity}</td>
                        <td className="align-middle">{productDetail.subTotal == "" ? "" : (productDetail.subTotal).toFixed(2)}</td>

                    </tr>
                )
        )
    }

    function TotalOrderSummaryRender() {
        return (

            orderCode.length == 15
                ?
                membershipPackageDetails.length == 0 ?
                    ((deliveryFee * 1) + (paymentFee * 1)).toFixed(2) :
                    (membershipPackageDetails
                        .map(membershipPackageDetail => membershipPackageDetail.subTotal)
                        .reduce((prev, next) => prev + next)
                        + (deliveryFee * 1) + (paymentFee * 1)).toFixed(2)
                :
                productDetails.length == 0 ?
                    ((deliveryFee * 1) + (paymentFee * 1)).toFixed(2) :
                    (productDetails
                        .map(productDetail => productDetail.subTotal)
                        .reduce((prev, next) => prev + next)
                        + (deliveryFee * 1) + (paymentFee * 1)).toFixed(2)
        )
    }





    return (
        <section id="order-package-form">
            <div className="container my-5">
                <h1 className="text-start text-primary mb-0">Order Payment Form</h1>
                <div className="row my-5">
                    <div className="container">
                        <h4 className="text-start text-primary mb-0">Order Tracking</h4>
                        <p className="text-start m-0 p-0"><sub >Ensure to copy this code for tracking purposes</sub></p>
                        <h5 className="text-start text-light m-0 p-2 bg-primary"><b>Order Tracking Code: </b>{orderCode}</h5>

                        {/* Status Bar Step */}
                        {/* ======================================== */}
                        <div className="mt-3">
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                {orderStatusRender()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-2">
                        <h4 className="text-start text-primary">Payment Details</h4>
                        <div className="mb-2">
                            <p className="text-start mb-0 fw-bold">Payment Option</p>
                            <select className="form-control"
                                onChange={(e) => {
                                    const [paymentOptionTemp, paymentFeeTemp] = (e.target.value).split(",");
                                    setPaymentOption(paymentOptionTemp);
                                    setPaymentFee(paymentFeeTemp);
                                    orderCode.length == 15
                                        ? updatePackage(paymentOptionTemp, paymentFeeTemp)
                                        : updateProduct(paymentOptionTemp, paymentFeeTemp);
                                }}>
                                <option defaultValue>Please select Payment Option...</option>
                                {paymentOptions.map((paymentOption) =>
                                    <option key={paymentOption.id} value={[paymentOption.payment_option, paymentOption.payment_fee]}>{paymentOption.payment_option}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-2">
                        <h4 className="text-start text-primary mb-2">Membership Package Summary</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="col-6">Description</th>
                                    <th className="col-2">Price</th>
                                    <th className="col-1">Quantity</th>
                                    <th className="col-3">SubTotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OrderSummaryRender()}
                                <tr>
                                    <td className="align-middle">
                                        <p className="mb-0">Delivery Fees:</p>
                                        <p className="mb-0">{deliveryOption}</p>
                                    </td>
                                    <td className="align-middle">{(deliveryFee * 1).toFixed(2)}</td>
                                    <td className="align-middle"></td>
                                    <td className="align-middle">{(deliveryFee * 1).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">
                                        <p className="mb-0">Others:</p>
                                        <p className="mb-0">{paymentOption}</p>
                                    </td>
                                    <td className="align-middle">{(paymentFee * 1).toFixed(2)}</td>
                                    <td className="align-middle"></td>
                                    <td className="align-middle">{(paymentFee * 1).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Discounts</td>
                                    <td className="align-middle">TBD</td>
                                    <td className="align-middle"></td>
                                    <td className="align-middle">0.00</td>
                                </tr>
                                <tr>
                                    <td className="align-middle"></td>
                                    <td className="align-middle"></td>
                                    <th className="align-middle">Total</th>
                                    <td className="align-middle">
                                        {TotalOrderSummaryRender()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className=" row mt-3 d-flex justify-content-center">
                    <a className={"btn btn-success w-75" + (!checkOutURL ? " disabled" : "")} href={checkOutURL}
                        disabled={!checkOutURL ? true : false} role="button">Pay Now!</a>
                </div>
            </div>
        </section>
    )
}

export default withRouter(OrderPaymentForm)
