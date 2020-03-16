import React, { useState, useEffect } from 'react';
import './Home.css';

import CompanyCard from '../components/CompanyCard'

import { Button, Checkbox, Input, Pagination, Spin, Result } from 'antd'

import { RouteComponentProps, navigate, useLocation } from "@reach/router"
import { Review } from '../reviews'

import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { database } from '../database'

import Fuse from "fuse.js";

// let test_rev = test_data[1]
// database.collection('review').doc(test_rev.id).set(test_rev)

const keyMap:{[key: string]: string} = {
  'Position': "position",
  'Company': "company.name",
  'Description': "description",
}

interface HomeProps extends RouteComponentProps { children?: any }
const Home = (props: HomeProps) => {
  const searchOptions = ['Position', 'Company', 'Description'];
  const location = useLocation();
  const [searchState, setSearchState] = useState<{ indeterminate: boolean, checkAll: boolean, checkedList: CheckboxValueType[]}>({
    indeterminate: false,
    checkedList: ['Position', 'Company', 'Description'],
    checkAll: true,
  })
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
  const [searchText, setSearchText] = useState<string>('')
  var urlParams = new URLSearchParams(props.location?.search);
  

  useEffect(() => {
    // getReviews(props.location?.search);
    // return globalHistory.listen(({ location }) => {
    //   getReviews(location.search);
    // });
    setSearchText(urlParams.get('text') || '')
    getReviews(location.search);
  }, [location]);

  function getReviews(search) {
    urlParams = new URLSearchParams(search)
    // console.log(Array.from(urlParams.entries()));
    
    database.collection('review').where('is_visible', '==', true).get().then(data => {
      let reviews_data = data.docs.map(d => d.data())
      if (urlParams.has('text') && urlParams.get('text') !== '') {
        let keys:string[]|undefined = ["position", "company.name", "description"]
        if (urlParams.has('in')) {
          keys = urlParams.get('in')?.split(',').reduce((acc, cur) => [...acc, keyMap[cur]], [] as string[])
        }
        var options = {
          shouldSort: true,
          threshold: 0.45,
          location: 0,
          distance: 100,
          maxPatternLength: 100,
          minMatchCharLength: 1,
          keys
        };
        // console.log(reviews);
        var fuse = new Fuse(reviews_data, options);
        setPage(1);
        setReviews(fuse.search(urlParams.get('text') || '') as Review[])
      } else {
        reviews_data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setReviews([...reviews_data] as Review[])
      }
    }).catch(err => {
      // console.log(err);
    })
  }

  const [page, setPage] = useState<number>(1)
  const [reviewsPerPage, setReviewsPerPage] = useState<number>(10)

  return (
    <div className="Home">
      <div className="jumbotron">
        <div className="jumbotron__content">
          <h1>Don't go into your internship <b>blind</b></h1>
          <div className="jumbotron__review">
            Empower your peers &ensp; <Button type="primary" onClick={() => navigate('/submit')}>✎ Write a Review</Button>
          </div>
        </div>
        {/* <p className="jumbotron__subtitle">Read reviews from other students about their internship and co-op experiences, so you can find an experience you'll love.</p> */}
        
      </div>
      {/* <div className="write-review">
        Empower your fellow students:
        <br/>
        <Button type="primary">Write a Review</Button>
      </div> */}

      <div className="search">
        <Input.Search 
          placeholder="Search reviews"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={value => navigate(`?text=${escape(value)}` + (searchState.indeterminate == false ? '' : `&in=${searchState.checkedList.join(',')}`))}
        />
        <div className="search__options">
          Search in:&ensp;
          <Checkbox
              style={{ marginRight: '8px' }}
              indeterminate={searchState.indeterminate}
              checked={searchState.checkAll}
              onChange={e => setSearchState({
                checkedList: e.target.checked ? searchOptions : [],
                indeterminate: false,
                checkAll: e.target.checked,
              })}>
              Everything
          </Checkbox>
          <Checkbox.Group
            options={searchOptions}
            value={searchState.checkedList}
            onChange={checkedList => setSearchState({
              checkedList,
              indeterminate: !!checkedList.length && checkedList.length < searchOptions.length,
              checkAll: checkedList.length === searchOptions.length,
            })}
          />
        </div>
      </div>
      <div className="reviews-container">
        <Pagination
          // showSizeChanger
          current={page}
          total={reviews?.length}
          hideOnSinglePage
          onChange={(page, pageSize) => setPage(page)}
          // showTotal={total => `Total ${total} items`}
          pageSize={reviewsPerPage}
          onShowSizeChange={(cur, pageSize) => setReviewsPerPage(pageSize)}
        />
        <div className="reviews">
          {reviews ? 
            (reviews.length > 0 ?
              reviews.slice((page - 1) * 10, page * 10).map((review, i) => <CompanyCard key={i} name={review.company.name} image={review.company.image} description={review.company.description} reviews={[review]} />)
              :
              <Result
                status="warning"
                title="Search returned 0 results"
                style={{gridColumn: '1 / 3'}}
              />
            ) :
            <Spin size="large" />
          }
        </div>
        <Pagination
          // showSizeChanger
          current={page}
          total={reviews?.length}
          hideOnSinglePage
          onChange={(page, pageSize) => setPage(page)}
          // showTotal={total => `Total ${total} items`}
          pageSize={reviewsPerPage}
          onShowSizeChange={(cur, pageSize) => setReviewsPerPage(pageSize)}
        />
      </div>
    </div>
  );
}

export default Home;