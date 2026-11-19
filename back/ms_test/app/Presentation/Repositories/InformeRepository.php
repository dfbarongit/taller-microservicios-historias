<?php
namespace App\Presentation\Repositories;

use App\Controllers\InformesController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Exception;

class InformeRepository
{
    public function getConteoPorEstado(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new InformesController();
            $datos = $controller->getConteoPorEstado();

            if ($datos->isEmpty()) {
                $error = ['error' => 'No se encontraron informes por estado'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode($datos, JSON_NUMERIC_CHECK));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $error = ['error' => 'Error al obtener el informe por estado'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getConteoPorEstadoPorSprint(Request $request, Response $response, array $args): Response
    {
        try {
            $idSprint = (int) $args['idSprint'];
            $controller = new InformesController();
            $datos = $controller->getConteoPorEstadoPorSprint($idSprint);

            if ($datos->isEmpty()) {
                $error = ['error' => 'No se encontraron historias para este sprint'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode($datos, JSON_NUMERIC_CHECK));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $error = ['error' => 'Error al obtener el informe por estado del sprint'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getConteoPorResponsable(Request $request, Response $response, array $args): Response
    {
        try {
            $controller = new InformesController();
            $datos = $controller->getConteoPorResponsable();

            if ($datos->isEmpty()) {
                $error = ['error' => 'No se encontraron informes por responsable'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode($datos, JSON_NUMERIC_CHECK));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $error = ['error' => 'Error al obtener el informe por responsable'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getConteoPorResponsablePorSprint(Request $request, Response $response, array $args): Response
    {
        try {
            $idSprint = (int) $args['idSprint'];
            $controller = new InformesController();
            $datos = $controller->getConteoPorResponsablePorSprint($idSprint);

            if ($datos->isEmpty()) {
                $error = ['error' => 'No se encontraron responsables para este sprint'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode($datos, JSON_NUMERIC_CHECK));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $error = ['error' => 'Error al obtener el informe por responsable del sprint'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}