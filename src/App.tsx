import React from 'react';
import './test.less'
import './App.css';

import Home from './pages/Home'

import { Router, Link, RouteComponentProps, Location, navigate } from "@reach/router";
import { InfoCircleOutlined, BarsOutlined, MenuOutlined } from '@ant-design/icons';
import { CookiesProvider } from 'react-cookie';
import { Button, Menu, Dropdown, Result, BackTop } from 'antd';
import SubmitReview from './pages/SubmitReview';
import About from './pages/About';
import Review from './pages/Review';
// import Headroom from 'react-headroom'
import { useMediaQuery } from 'react-responsive';

import logo from './images/canaryLogo-img.png';
import uffizziLogo from './images/uffizzi-logo-blue-yellow.png';
// import { database } from './database';
// import { reviews } from './reviews'

// database.collection('review').where('is_visible', '==', true).get().then(data => {
//   console.log(data.docs.map(d => d.data()));

// })

// reviews.forEach(review => {
//   database.collection('review').doc(review.id).set(review).then(() => {
//     console.log('success');

//   }).catch(err => {
//     console.log('fail');
//   })
// })

// database.collection("review").orderBy("Position").startAt("4140-").endAt("4140-\uf8ff").get().then(snap => {
//   snap.forEach(doc => {
//     console.log(doc.data());
//   })
// }).catch(error => {
//   console.log("Error getting document:", error);
// });

const ReviewNotFound: React.SFC<RouteComponentProps> = props => (
  <div className="not-found">
    <Result
      status='error'
      title="Review not found"
      subTitle="Sorry, we can't find that review."
      extra={<Button onClick={() => navigate('/')}>Back Home</Button>}
    />
  </div>
)

const ReviewSuccess: React.SFC<RouteComponentProps> = props => (
  <div className="submit-success">
    <Result
      status='success'
      title="Review Submitted!"
      subTitle="Thank you for helping your fellow student! Your review is now awaiting approval by our moderation team and will be live once it is approved."
      extra={<Button onClick={() => navigate('/submit')}>Write another review</Button>}
    />
  </div>
)

const ReviewError: React.SFC<RouteComponentProps> = props => (
  <div className="submit-error">
    <Result
      status='error'
      title="Review not found"
      subTitle="Sorry, there was an error submitting your review."
      extra={<Button onClick={() => navigate('/submit')}>Try Again</Button>}
    />
  </div>
)

const { SubMenu } = Menu;

  // < PageHeader title = {< Link to = "/" > <img className="logo" src={logo} /></Link>}></PageHeader >

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/"><BarsOutlined /> Reviews</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/submit">✎  Write a review</Link>
    </Menu.Item>

    {/*<Menu.Item>
      <Link to="/about"><InfoCircleOutlined />About page</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/login"><InfoCircleOutlined />Login</Link>
    </Menu.Item>*/}
  </Menu>
);

const DropdownMenu = () => {
  return (
    <div style={{ margin: '15px 15px 10px auto' }}>
      <Dropdown key="more" overlay={menu}>
        <Button
          style={{
            border: 'none',
            padding: 0,
          }}

        >
          <MenuOutlined
            style={{
              fontSize: 20,
              verticalAlign: 'left',
            }}
          />
        </Button>
      </Dropdown>
    </div>
  );
};

const App = () => {
  // const isSmall = useMediaQuery({ query: '(max-width: 630px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  return (
    <CookiesProvider>
      <div className="App">
        {/* <Headroom> */}
        <div className="headroom">
          <Location>
            {context => (
              <nav>
                < Link to="/" style={{ margin: 'auto 30px' }} > <img className="logo" src={logo} /></Link>
                {
                  isMobile ?
                    <DropdownMenu />
                    :
                    <Menu style={{ height: "100%", marginTop: 'auto' }} mode="horizontal" selectedKeys={[context.location.pathname.replace('/', '')||'reviews']}>
                      <Menu.Item key="reviews"><Link to="/"><BarsOutlined /> Reviews</Link></Menu.Item>
                      <Menu.Item key="submit"><Link to="/submit">✎ Write a review</Link></Menu.Item>
                      {/*<Menu.Item key="about"><Link to="/about"><InfoCircleOutlined /> About</Link></Menu.Item>
                      <Menu.Item key="login"><Link to="/login"><InfoCircleOutlined /> Login</Link></Menu.Item>*/}
                    </Menu>
                }
              </nav>
            )}
          </Location>
        </div>
        {/* </Headroom> */}
        <div className="background"></div>
        <BackTop/>
        {/* <Router>
          <Home path="/">
            <Review path="/reviews/:reviewID"></Review>
          </Home>
        </Router> */}
        {/* <Link to="/">Home</Link>.
        <Link to="/submit">Submit Review</Link> */}
        <div className="content">
          <Router primary={false}>
            <Home path="/"></Home>
            <Review path="/reviews/:reviewID" />
            <SubmitReview path="/submit" />
            <About path="/about"/>
            <ReviewNotFound path="/reviews/not-found" />
            <ReviewSuccess path="/submit-success" />
            <ReviewError path="/submit-error" />
          </Router>
        </div>
        <footer>
          <div className="canary-details">
            <div>
              <p>
                <span>Canary is a Georgia Tech Startup</span>
                <br></br>
                <span>Copyright © 2020 Canary Enterprises LLC. All rights reserved.</span>
              </p>
            </div>
            <a href="mailto:feedback@canarystudent.com">feedback@canarystudent.com</a>
          </div>
          <div className="host">
            Hosted by<br/>
            <a target="_blank" href="https://www.uffizzi.cloud/"><img src={uffizziLogo} style={{ width: '100px' }} alt="" /></a>
          </div>
        </footer>
      </div>
    </CookiesProvider>
  );
}

export default App;
