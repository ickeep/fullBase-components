import React, { Component } from 'react'
import {
  Svg,
  Captcha,
  Link,
  Cascader,
  Checkbox,
  ImgCaptcha,
  Input,
  Radio,
  RangeDate,
  Select,
  SelectTree,
  TextArea,
  Tree,
  Content,
  Currency,
  Datetime,
  IdCardEncrypt,
  KeyToValue,
  PhoneEncrypt,
  Loading
} from 'fullbase-components'
import http from "../api/http";

const { httpGet } = http

class App extends Component {
  state: { result: any } = { result: {} }

  async componentDidMount() {
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=4518260106bf4cfd948af9af8ee0d764&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=0d46c925e4b94bb2b74b1973013710d6&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=e43694621f7e46ed9c517a7769cb0c5e&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=aa9cbedd8855473bb2444907dc8d5b41&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=b2bb153f9fef4284b1bb4439e24fea6a&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=c45455ddb2a04e71add2bf31f3821ec1&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=edc31551a544417ebfccde32017efc9e&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=1b7633d728ac4cd8a8501303c533c14c&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=60ad10ff69c24ebbb45d7963eafbb537&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=106c8a085862449683725d572e957052&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=9de2d9fe59784ffb950a1f4ff6a5882f&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=0a5a2ba37c6f4a5abd9105e3b28b9993&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=dde64e1fd10440498946c0f724e7bb14&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=2b28e152bcd44329b2a9f42c1f6725e6&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=5e8d25e8f60f4fb698821c75130f958e&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=7999e00890894ad5aa327fcd004feff7&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=24b70ea9ae0b4630b588ab84f3d5e54d&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=d4561ce20f764dcfb1432906ae067fc1&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=24e1ed7de770465fae3bda2ae8ffedaf&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=df3c766bdf9e4b0b82a0edb5a43581ae&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=0b090b0d96e848a59f44c822cad0e2b8&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=d4bae365b45e4ba3a96b0816df36c4fa&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=699232e1215941dea1380a5e1e6d43fa&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=d61fca0bbf694326b555dc1728b63feb&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=015352d4461b442bb23e0b9b61eea83a&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=d5a70432c2654e3787f1a4e9f13a26fd&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=57a745df6eeb4a54b42fa92306e9f413&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=ea627e2a112f4b5588b1a3bded6e3aba&ln=0'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=ea627e2a112f4b5588b1a3bded6e3aba&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=3640694cac514b419b1c2cc2b9ac3fdb&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=6ba61222d9af4566a3ba03499a5aab0c&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=dc4002fbe71a44ccab3a50a8acaa17c2&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=0fd937992c3f443f89b65686168d416f&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=5cc09ba78c374f9c82025f262ad6987a&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=f4194623513847c28256923df6dfc7c3&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=e76d997a361f4bdeb4743e5071ce6972&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=234a363b777b4fbeb71e0e3a65bbe7e4&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=e51e3360a91641f89d547be0857f4b5d&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=87c26b67c9ec43d2bf1e1c2355fadc4d&ln=1'
    // const url = 'https://tkapi.eduueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=44f117d535ea40ac94a792424dd4d7d7&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=2bff079ea7614844a92d20f77aa66ec8&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=4816479c0a3441c8ba3d136631d17f3b&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=d56a9cde0d204f8f8a01d36caade190b&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=6994b62f93c54a16bd8ea877d4c288a4&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=11e19b273ce24691a6dd635358dfb01e&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=3744969cf9264b099bdd1043967e44d0&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=baf25d3e8cad4ef3bd1ea31beccccede&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=48f3245f782945a9b1eba400c6d7ab6a&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=5494c74ce59d448483bcabdec03d3812&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=70a0b794ec4a4a5282d3103908560de9&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=b689e23aa2754376bfab27ed36decfa4&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=a155f799468f42be8e38f7bad7c0a0bb&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=1c355b7581bc457184fe95afd09eb733&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=2cb6fff32fb641ed85239d73f48637f6&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=133cb24f6fe9479bb4c9876fe723e180&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=7ea3ee9bacd44040947e24b4cd31bd9a&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=b0ab26aae48645f78cc7c49bf2444d2e&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=8b8af47fc1894776ad588ae77f0bb3ba&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=08c7baa1d3b5426a957c3a7072d1d914&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=b622af94199448ccbdb03fa26c8a657f&ln=1'
    // const url = 'https://tkapi.edueva.org/yanshi/api/Knowdot/GetKnowDotQuestion?knowdotId=2a59dc3f57824265b8447382176992f0&batchId=f57429c01d6c4e6fb3c8a8a8011bb195&userId=dd91dcb11d51441d9d795fd6efa99f20&currentQuestionId=eb5b274967a341d7af1dd64f3136b077&ln=1'
    // const data: any = await httpGet(url)
    // this.setState({ result: data.result })
  }

  render() {
    const { result } = this.state
    const analysisText = result && result.question && result.question.AnalysisText || ''
    const questionStemContent = result && result.question && result.question.QuestionStemContent || ''
    const questionStems: any = result && result.question && result.question.QuestionStems || []
    // return (
    //   <div>
    //
    //     <Link href='/login'>登录</Link>
    //     <Svg src="404"/>
    //     <Captcha/>
    //     <Checkbox data={[2, 3, 4]}/>
    //     <Cascader/>
    //     <ImgCaptcha/>
    //     <Input/>
    //     <Radio data={{ 1: '111111', 2: '2222222' }}/>
    //     <RangeDate/>
    //     <Select data={{ 1: 'name1', 2: 'name2' }}/>
    //     <SelectTree/>
    //     <TextArea/>
    //     <Tree data={[{ id: 1, title: '1111' }]}/>
    //     <Content loading={true}/>
    //     <Currency value={123.4567}/>
    //     <Datetime/>
    //     <IdCardEncrypt value={445221198710065913}/>
    //     <IdCardEncrypt value={445221198710065913}/>
    //     <KeyToValue value={'name'} data={{ name: '名字' }} isTag={true}/>
    //     <PhoneEncrypt value={13923887814}/>
    //     <Loading/>
    //   </div>
    // )
    return <div style={{ padding: '30px' }}>
      <h3 dangerouslySetInnerHTML={{ __html: questionStemContent }}/>
      <h3 dangerouslySetInnerHTML={{ __html: analysisText }}/>
      {questionStems && questionStems.map && questionStems.map((item: any, index: number) => {
        const { QuestionStemContent, QuestionOptions } = item
        return <div key={index}>
          <h3 dangerouslySetInnerHTML={{ __html: QuestionStemContent }}/>
          {QuestionOptions && QuestionOptions.map && QuestionOptions.map((opt: any, index: number) => {
            const { OptionsId, OptionsKey, OptionsValue } = opt
            return <h4 key={OptionsId}>{OptionsKey}: {OptionsValue}</h4>
          })}
        </div>
      })}
    </div>
  }

}

export default App
