import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilDoor,
  cilExitToApp,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { userStore } from '../../stores/UserStore'
import { authStore } from '../../stores/AuthStore'

import { observer } from 'mobx-react-lite'

const AppHeaderDropdown = () => {
  const userData = userStore.userDetailByMe

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await authStore.logout()
    } catch (error) {
      toast.error(error.response.data.error.message)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {userData && userData.avatarUrl && <CAvatar src={userData.avatarUrl} size="md" />}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Settings</CDropdownHeader>
        <CDropdownItem href="/users/me">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem role="button" onClick={handleLogout}>
          <CIcon icon={cilExitToApp} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default observer(AppHeaderDropdown)
