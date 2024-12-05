import './MainHeader.css'

// The `MainHeader` component serves as a container for the main header elements 
// and allows for passing in custom content via `props.children`.
const MainHeader = props => {

    return (
        <header className='main-header'>
            {props.children} {/*Evrything in the MainNavigation return statement replace the props.children */}
        </header>
    );
}

export default MainHeader;