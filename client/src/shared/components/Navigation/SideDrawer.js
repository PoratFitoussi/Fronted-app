import { useRef } from 'react';
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import './SideDrawer.css'

// The `SideDrawer` component is a side navigation panel that uses React's `CSSTransition` 
// to animate its entry and exit from the screen. It is shown when the `props.show` is true 
// and hides when `props.show` is false. The transition animation is handled by the class `slide-in-left`.
const SideDrawer = props => {
  const nodeRef = useRef(null); //to fix a warning
  const content = (
    <CSSTransition
      nodeRef={nodeRef}
      in={props.show}
      timeout={300}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};



export default SideDrawer