import { API_ADDRESS } from '../config'

async function performAction({
  gameCode,
  teamId,
  actionId,
  actionValue,
  accessToken,
}) {
  const res = await fetch(
    `${API_ADDRESS}/api/games/${gameCode}/teams/${teamId}/actions`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        actionId,
        actionValue,
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    alert(err.message) // eslint-disable-line no-alert
    return {}
  }
  return res.json()
}

async function revertLastAction({ gameCode, teamId, accessToken }) {
  const res = await fetch(
    `${API_ADDRESS}/api/games/${gameCode}/teams/${teamId}/actions`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
      method: 'DELETE',
    }
  )
  if (!res.ok) {
    const err = await res.json()
    alert(err.message) // eslint-disable-line no-alert
    return {}
  }
  return res.json()
}

export default {
  performAction,
  revertLastAction,
}
