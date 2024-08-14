
import './MainHeader.css'

const MainHeader = (props) => {           // children are anything which you pass inside the component 
    return (
        <header className='main-header'>
            {props.children}               
        </header>
    );
}
 
export default MainHeader;