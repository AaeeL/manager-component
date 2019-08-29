import { Router } from 'express';
import queryString from 'querystring';
import request from 'request';
import credentials from '../../keys/credentials';

const loginRouter = (module.exports = new Router());

const stateKey = 'spotify_auth_state';
const redirect_uri = 'http://localhost:8000/api/manager/callback';
const getState = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

loginRouter.get('/login', (req, res) => {
  const state = getState();
  const client_id = credentials.CLIENT_ID;
  const access_control =
    'user-read-private user-read-email user-read-playback-state user-top-read';
  const scope = access_control;
  res.cookie(stateKey, state);
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

loginRouter.get('/callback', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const client_id = credentials.CLIENT_ID;
  const client_secret = credentials.CLIENT_SECRET;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state == !storedState)
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    };
    request.post(authOptions, (err, response, body) => {
      if (!err) {
        console.log(body);
        res.redirect(
          'http://localhost:8000#' +
            queryString.stringify({
              access_token: body.access_token,
              refresh_token: body.refresh_token
            })
        );
      } else {
        res.json({
          success: false,
          err
        });
      }
    });
  }
});
