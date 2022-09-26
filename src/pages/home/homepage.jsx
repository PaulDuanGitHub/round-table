import { Component } from "react";
import table_img from "../../img/homepage_background.svg";
import arrows from "../../img/arrows.svg"
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom"
class Homepage extends Component{
    toIndex = ()=>{
        window.location.href = "/index"
    }
    render(){
        return(
            <div style={
                // 设置图片背景
                {backgroundImage:`url(${table_img})`
                , width:"100%",height:"100%"
                , backgroundSize:"100%"
                , backgroundRepeat:"no-repeat"
                , position:"absolute" // 脱离文档流
                }
                }>
                <div style={{color:"white", fontSize:"80px", left:"50px", marginLeft:"15px"}}>Round Table</div>
                {/* 链接按钮 */}
                <div style={{textAlign:"end"}}>
                    <div style={{position:"relative", top:"150px",right:"10px"}}>
                    <img alt="" src={arrows} style={{scale:"0.8", cursor:"pointer"}} draggable={false} onClick={this.toIndex}></img>
                    <div style={{position:"relative",right:"10px", fontSize:"25px", color:"white"}}>Try It Now</div>
                    </div>
                </div>
                {/* <NavLink style={{top:"50px"}} to='/index'>
                    <Button>Test</Button>
                </NavLink> */}
            </div>
        )
    }
}

export default Homepage