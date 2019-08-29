import { Router } from 'express';
import request from 'request';

const dataRouter = (module.exports = new Router());

dataRouter.post('/get_user_data', (req, res) => {
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + req.body.access_token },
    json: true
  };
  request.get(options, (err, response, body) => {
    if (err)
      res.json({
        success: false,
        error: err
      });
    res.json({
      success: true,
      data: body
    });
  });
});

dataRouter.post('/get_currently_playing', (req, res) => {
  const options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: 'Bearer ' + req.body.access_token },
    json: true
  };
  request.get(options, (err, response, body) => {
    if (err)
      res.json({
        success: false,
        error: err
      });
    res.json({
      success: true,
      data: body
    });
  });
});

dataRouter.post('/get_user_top', async (req, res) => {
  const options = {
    url:
      'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term',
    headers: { Authorization: 'Bearer ' + req.body.access_token },
    json: true
  };
  request.get(options, (err, response, body) => {
    if (err)
      res.json({
        success: false,
        error: err
      });
    res.json({
      success: true,
      data: body.items
    });
  });
});
