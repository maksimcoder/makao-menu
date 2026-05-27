export type AmenityId = 'wifi' | 'hookah' | 'cocktail' | 'pc' | 'gamepad'

export type CategoryIconId =
  | 'cocktail'
  | 'lemonade'
  | 'wine'
  | 'whiskey'
  | 'spirits'
  | 'cognac'
  | 'hookah'
  | 'dessert'
  | 'coffee'

export interface Brand {
  name: string
  subtitle: string
}

export interface PhoneContact {
  display: string
  tel: string
}

export interface SocialLink {
  handle: string
  url: string
}

export interface AddressInfo {
  text: string
  mapUrl: string
}

export interface LandingData {
  schedule: string[]
  phone: PhoneContact
  instagram: SocialLink
  address: AddressInfo
  amenities: AmenityId[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  currency: string
  image: string
  isNew?: boolean
}

export interface MenuGroup {
  id: string
  label: string
  items: MenuItem[]
}

export interface MenuCategory {
  id: string
  label: string
  icon: CategoryIconId
  groups: MenuGroup[]
}

export interface MenuSection {
  id: string
  label: string
  categories: MenuCategory[]
}

export interface BottomNavItem {
  id: string
  label: string
  type: 'home' | 'menu' | 'delivery'
  section?: string
  url?: string
  logo?: string
}

export interface DeliveryLink {
  id: string
  label: string
  url: string
  logo?: string
}

export interface Establishment {
  slug: string
  brand: Brand
  defaultMenuSection?: string
  landing: LandingData
  bottomNav: BottomNavItem[]
  menu: {
    sections: MenuSection[]
  }
  deliveryLinks?: DeliveryLink[]
}
