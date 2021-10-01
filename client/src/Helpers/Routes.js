import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from '../Components/Login';
import Signup from '../Components/Signup';

function Routes() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Signup} />
          <Route exact path="/Login" component={Login} />
          {/* {user?.uid
          ? <Route exact path="/ChatPreview" component={() => ChatPreview({ user })} />
          : <Route exact path="/Login" component={Login} />} */}
        </Switch>
      </Router>
    </div>
  );
}

export default Routes;
