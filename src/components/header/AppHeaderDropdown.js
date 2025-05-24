import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilUser, cilExitToApp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { userStore } from '../../stores/UserStore'
import { authStore } from '../../stores/AuthStore'
import { observer } from 'mobx-react-lite'
import defaultAvatar from '../../assets/images/avatars/avatar.png'
import classes from '../../assets/AppHeaderDropDown/AppHeaderDropDown.module.css'

const AppHeaderDropdown = () => {
  const userData = userStore.userDetailByMe
  if (!userData) {
    return null
  }

  const avatar = userData.avatarUrl || defaultAvatar

  const handleLogout = async (e) => {
    const confirmation = window.confirm("Are you sure logout?");
    if (!confirmation) {
      return
    }
    e.preventDefault()
    await authStore.logout()
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size="sm" className={classes['custom-avatar']}/>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Xin chào!</CDropdownHeader>
        <CDropdownItem href="/profile-settings">
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
