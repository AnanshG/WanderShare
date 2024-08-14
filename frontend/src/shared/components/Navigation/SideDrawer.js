import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import './SideDrawer.css'


const SideDrawer = (props) => {
    const content =                     // using CSS transtion from dependancy for sidebar animation    // read doc for more info // show prop is entered when we use component
    <CSSTransition in = {props.show} timeout={200} classNames={"slide-in-left"} mountOnEnter unmountOnExit>
    <aside onClick={props.onClick} className='side-drawer'>{props.children} </aside>
    </CSSTransition>            // as we are using jsx we can store html in variables also and not just only return it
                                                                                            
                                                                                            // use of portal in react to render a component in different area of html docuemt
    return ReactDOM.createPortal(content , document.getElementById('drawer-hook'))          // this is not necessary to use but not it is rendered inside drawer hook and it is outside the root
}                                                                                           // here the content is part of the component tree but is rendered somewhere else in html doc
 
export default SideDrawer;