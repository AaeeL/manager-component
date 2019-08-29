import { Router } from 'express';
import request from 'request';
import credentials from '../../keys/credentials';

const tokenRouter = (module.exports = new Router());

tokenRouter.post('/refresh_access_token', (req, res) => {
  const client_id = credentials.CLIENT_ID;
  const client_secret = credentials.CLIENT_SECRET;
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    grant_type: 'refresh_token',
    form: {
      refresh_token: req.body.refresh_token,
      content_type: 'application/x-www-form-urlencoded',
      grant_type: 'refresh_token'
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    json: true
  };
  request.post(options, (err, response, body) => {
    if (err)
      res.json({
        success: false,
        err
      });
    res.json({
      success: true,
      body
    });
  });
});
