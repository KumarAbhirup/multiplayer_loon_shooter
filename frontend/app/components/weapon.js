/* eslint-disable no-unused-vars */

/* 
  global
  Koji
  dispatch
  GameObject
*/

class Weapon extends GameObject {
  owner = this.settings.owner

  weaponType = this.owner.weaponType
}
