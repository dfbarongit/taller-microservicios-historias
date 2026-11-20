<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../app/global/database_config.php';

$routers = require __DIR__.'/../app/Presentation/Routers/endpoints.php';
$app = AppFactory::create();

$routers($app);
$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->get('/inicio', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world! Desde inicio");
    return $response;
});

$app->post('/saludo', function (Request $request, Response $response, $args) {
    $body = $request->getBody()->getContents();
    $data = json_decode($body, true);
    $nombre = $data['nombre'];
    $edad = $data['edad'];
    $response->getBody()->write("Hola $edad, tu edad es $nombre");
    #$response->getBody()->write("Hello world! Desde inicio");
    return $response;
});

$cors = require __DIR__ . '/../app/Middlewares/cors.php';
$cors($app);


$app->run();

