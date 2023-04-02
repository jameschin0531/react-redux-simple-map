import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clear,
  selectRecentSearch,
  spliceLocation
} from './recentSearchSlice';
import styles from './RecentSearch.module.css';
import { Space, Tag } from 'antd';

export function RecentSearch() {
  const recentSearch = useSelector(selectRecentSearch);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;
  const renderRecenSearch = () => {
    return recentSearch.map((location, index) => {
      return (
        <Tag
          key={index + location}
          closable
          onClose={() => dispatch(spliceLocation(index))}
        >
          {location}
        </Tag>
      );
    });
  }

  return (
    <div>
      <div className={styles.row}>
        <Space size={[0, 8]} wrap>
          {renderRecenSearch()}
        </Space>
        <button
          onClick={() => dispatch(clear())}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
