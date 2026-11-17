<?php

// use Psr\Http\Message\ResponseInterface as Response;
// use Psr\Http\Message\ServerRequestInterface as Request;
use App\Presentation\Repositories\SprintRepository;
use App\Presentation\Repositories\HistoriaRepository;
use Slim\App;

return function (App $app) {
    // $app->get('/usuarios', function (Request $request, Response $response, $args) {
    //     $repository = new UserRepository();
    //     return $repository->all($request, $response, $args);
    // });
    
    $app->get('/sprints', [SprintRepository::class, 'getAllSprints']);
    $app->get('/sprints/{id}', [SprintRepository::class, 'find_sprint']);
    $app->post('/sprints', [SprintRepository::class, 'create']);
    $app->put('/sprints/{id}', [SprintRepository::class, 'update']);
    $app->delete('/sprints/{id}', [SprintRepository::class, 'delete']);

    $app->get('/historias', [HistoriaRepository::class, 'getAllHistorias']);
    $app->get('/historias/{id}', [HistoriaRepository::class, 'find_historia']);
    $app->get('/sprints/{id}/historias', [HistoriaRepository::class, 'getBySprintId']);
    $app->post('/historias', [HistoriaRepository::class, 'create']);
    $app->put('/historias/{id}', [HistoriaRepository::class, 'update']);
    $app->delete('/historias/{id}', [HistoriaRepository::class, 'delete']);
};