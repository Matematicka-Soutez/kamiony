import React from 'react'
import { GAME_ID } from '../config'

function DisplayPage() {
  return (
    <div>
      <h1>Kamiony</h1>
      <ul>
        <li>
          <a href={`/hra/${GAME_ID}`}>Dataprojektor</a>
        </li>
        <li>
          <a href={`/hra/${GAME_ID}/admin/ACCESS_TOKEN`}>Zadavatko</a>
        </li>
        <li>
          <a href={`/hra/${GAME_ID}/vzdalenosti`}>Mapa se vzdalenostmi</a>
        </li>
        <li>
          <a href={`/hra/${GAME_ID}/teams/1/history`}>Statistiky tymu 1</a>
        </li>
        <li>
          <a href={`/hra/${GAME_ID}/vysledky`}>Vysledkovka</a>
        </li>
      </ul>
    </div>
  )
}

export default DisplayPage
