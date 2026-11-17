<?php

namespace App\Controllers;

use App\Models\Historia;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class HistoriasController
{
    function getAllHistorias(): Collection
    {
        return Historia::all();
    }
    public function getBySprintId(int $sprintId): Collection
    {
        return Historia::where('sprint_id', $sprintId)->get();
    }
    function find_historia(int $id): Historia
    {
        return Historia::findOrFail($id);
    }

    function create(array $data): Historia
    {
        $historia = new Historia();
        $historia->titulo = $data["titulo"];
        $historia->descripcion = $data["descripcion"];
        $historia->responsable = $data["responsable"];
        $historia->estado = $data["estado"];
        $historia->puntos = $data["puntos"];
        $historia->fecha_creacion = $data["fecha_creacion"];
        $historia->fecha_finalizacion = $data["fecha_finalizacion"];
        $historia->sprint_id = $data["sprint_id"];
        $historia->save();
        return $historia;
    }

    function update(int $id, array $data):Historia{
        $historia = Historia::findOrFail($id);
        $historia->titulo = $data["titulo"];
        $historia->descripcion = $data["descripcion"];
        $historia->responsable = $data["responsable"];
        $historia->estado = $data["estado"];
        $historia->puntos = $data["puntos"];
        $historia->fecha_creacion = $data["fecha_creacion"];
        $historia->fecha_finalizacion = $data["fecha_finalizacion"];
        $historia->sprint_id = $data["sprint_id"];
        $historia->save();
        return $historia;
    }

    function delete(int $id):Historia{
        $historia = Historia::findOrFail($id);
        $historia->delete();
        return $historia;
    }
}
