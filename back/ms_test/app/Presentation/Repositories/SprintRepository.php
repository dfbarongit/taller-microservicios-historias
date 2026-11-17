<?php
namespace App\Presentation\Repositories;

use App\Controllers\SprintsController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SprintRepository
{
    public function getAllSprints(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new SprintsController();
            $sprints = $controller->getAllSprints();
            $response->getBody()->write(json_encode($sprints));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (ModelNotFoundException $e) {
            $error = ['error' => 'No sprints found'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
    }
    public function find_sprint(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new SprintsController();
            $sprint = $controller->find_sprint((int) $args['id']);
            $response->getBody()->write(json_encode($sprint));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (ModelNotFoundException $e) {
            $error = ['error' => 'Sprint not found'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
    }
    public function create(Request $request, Response $response, array $args): Response
    {
        $body = $request->getBody()->getContents();
        $data = json_decode($body, true);
        $controller = new SprintsController();
        $sprint = $controller->create($data);
        $response->getBody()->write(json_encode($sprint));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
    public function update(Request $request, Response $response, array $args): Response
    {
        $body = $request->getBody()->getContents();
        $data = json_decode($body, true);
        $controller = new SprintsController();
        $sprint = $controller->update($args['id'], $data);
        $response->getBody()->write(json_encode($sprint));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
    public function delete(Request $request, Response $response, array $args): Response
    {
        $controller = new SprintsController();
        $sprint = $controller->delete($args['id']);
        $response->getBody()->write(json_encode($sprint));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}