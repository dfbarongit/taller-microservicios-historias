<?php
namespace App\Presentation\Repositories;

use App\Controllers\HistoriasController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class HistoriaRepository
{
    public function getAllHistorias(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new HistoriasController();
            $Historias = $controller->getAllHistorias();
            $response->getBody()->write(json_encode($Historias));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (ModelNotFoundException $e) {
            $error = ['error' => 'No Historias found'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
    }
    public function getBySprintId(Request $request, Response $response, array $args): Response
    {
            $sprintId = (int) $args['id'];
            $controller = new HistoriasController();
            $historias = $controller->getBySprintId($sprintId);

            // $historias->toJson() o json_encode($historias)
            $response->getBody()->write($historias->toJson());
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
    public function find_historia(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new HistoriasController();
            $historia = $controller->find_historia((int) $args['id']);
            $response->getBody()->write(json_encode($historia));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (ModelNotFoundException $e) {
            $error = ['error' => 'Historia not found'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
    }
    public function create(Request $request, Response $response, array $args): Response
    {
        $body = $request->getBody()->getContents();
        $data = json_decode($body, true);
        $controller = new HistoriasController();
        $historia = $controller->create($data);
        $response->getBody()->write(json_encode($historia));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
    public function update(Request $request, Response $response, array $args): Response
    {
        $body = $request->getBody()->getContents();
        $data = json_decode($body, true);
        $controller = new HistoriasController();
        $historia = $controller->update($args['id'], $data);
        $response->getBody()->write(json_encode($historia));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
    public function delete(Request $request, Response $response, array $args): Response
    {
        $controller = new HistoriasController();
        $historia = $controller->delete($args['id']);
        $response->getBody()->write(json_encode($historia));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}