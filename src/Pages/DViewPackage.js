import React from 'react'
import DHeader from './Components/DHeader';
import Footer from './Components/Footer';
import DViewPackageComp from './Components/DViewPackageComp';

function DViewPackage() {
    return (
        <div>
            <DHeader></DHeader>
            <DViewPackageComp></DViewPackageComp>
            <Footer></Footer>
        </div>
    )
}

export default DViewPackage
