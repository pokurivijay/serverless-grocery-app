/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardActions, CardTitle, FlatButton } from 'material-ui';


import { pink500, pink800, pinkA200 } from 'material-ui/styles/colors';
import Quantity from '../../base_components/Quantity';
import ProductImageWrap from '../../base_components/ProductImage';
import { updateCartItems } from '../../actions/cart';

const ItemWrap = styled(Card)`
  box-shadow: none !important;
  margin: 1em 0.5em;
  overflow: hidden;
  border-radius: 4px;
  text-align: left;
  position: relative;
  width: 270px;
  border: 1px solid transparent;
  &:hover{
    border: 1px solid #eee;
    box-shadow: 1px 3px 4px 0px rgba(144,144,144,0.44), 0px 0px 2px rgba(144,144,144,1) !important;
  }
`;

const AddCart = styled(FlatButton)`
  &:hover{
    ${props => (!props.disabled ? `
      color: #fff !important;
      font-weight: bold;
      background-color: ${pinkA200} !important;
    ` : '')}
    > div{
      color: #fff !important;      
      > span{
        color: #fff !important;      
      }
    }
  }
  font-size: 12px;
`;

const soldOutColor = pink500;

const SoldOut = styled.span`
  background: ${soldOutColor};
  color: #fff;
  position: absolute;
  z-index: 2;
  padding: 8px;
  margin: 0 auto;
  top: 0;
  left: 0;
  width: calc(100% + 16px);
  transform: translate(-16px, 0%);
  &:after, &:before{
    content: '';
    position: absolute;
    top: 99%;
    left: 0;
    border: solid transparent;

  }
  &:after{
    border-width: 8px;
    border-right-color: ${soldOutColor};
    border-top-color: ${soldOutColor};
  }
`;

const CrossSoldOut = styled.span`
    background: ${soldOutColor};
    color: #fff;
    position: absolute;
    z-index: 1;
    padding: 15px;
    margin: 0 auto;
    top: 20%;
    left: 0px;
    width: calc(140% + 10px);
    -webkit-transform: translate(-16px,0%);
    -ms-transform: translate(-16px,0%);
    transform: translate(-12%,40%) rotate(40deg);
    text-align: center;
`;


class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
    };
  }

  saveToCart = () => {
    this.props.updateCartItems(this.props.groceryId, this.state.quantity);
  };

  displaySoldOut = () => {
    const { isSoldOut } = this.props;

    if (isSoldOut) {
      return (
        <CrossSoldOut>
          Sold out
        </CrossSoldOut>);
    }
    return null;
  };

  displayQuantityCounter = (max) => {
    const { isSoldOut } = this.props;

    if (!isSoldOut) {
      return (
        <Quantity
          size={30}
          onChange={data => this.setState({ quantity: data })}
          initialQuantity={this.state.quantity}
          maxQuantity={max}
          disabled={isSoldOut}
        />);
    }
    return null;
  };

  render() {
    const {
      name, price, url, isSoldOut,
    } = this.props;
    return (
      <ItemWrap
        containerStyle={{
          margin: '0 auto',
        }}
      >
        {this.displaySoldOut()}
        <ProductImageWrap isSoldOut={isSoldOut}>
          <img src={url} alt="" />
        </ProductImageWrap>
        <CardTitle
          title={name}
          titleStyle={{
            fontSize: 20,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          subtitleStyle={{
            fontSize: 18,
          }}
          subtitle={price ? `${price} ₹` : ''}
        />

        <CardActions
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {
            this.displayQuantityCounter(this.props.quant)
          }

          <AddCart
            onClick={this.saveToCart}
            disabled={isSoldOut}
            rippleColor={pink800}
            labelPosition="before"
            secondary
            label="Add to Cart"
          />

        </CardActions>
      </ItemWrap>
    );
  }
}

ProductItem.defaultProps = {
  isSoldOut: false,
};


ProductItem.propTypes = {
  groceryId: PropTypes.number.isRequired,
  quant: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isSoldOut: PropTypes.bool,
  updateCartItems: PropTypes.func.isRequired,
};

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCartItems,
  }, dispatch);
}

export default connect(null, initMapDispatchToProps)(ProductItem);