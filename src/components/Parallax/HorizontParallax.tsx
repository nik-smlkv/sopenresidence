import React from 'react'

const HorizontParallax = () => {
    const ParallaxCards: {img: string | null, name: string | null, text: string} [] = [
        {img: "", name: "", text: "Residents don’t have to travel far to enjoy themselves — entertainment is delivered right to their doorstep.",},
        {img: "beautiful-spa-client-with-tisane-looking-into-distance.jpg", name: "Wellness center", text: "",},
        {img: "close-up-barista-making-cappuccino-bartender-preparing-coffee-drink-1.jpg", name: "Supermarket", text: "",},
        {img: "close-up-barista-making-cappuccino-bartender-preparing-coffee-drink.jpg", name: "Pharmacy", text: "",},
        {img: "customer-choosing-milk-products-supermarket-refrigerator.jpg", name: "Café", text: "",},
        {img: "pharmacist-work.jpg", name: "Business apartments", text: "",},
        {img: "young-adult-woman-pushing-shopping-trolley-shelves-market.jpg", name: "Other commercial spaces", text: "",},
    ]
  return (
    <div>{ParallaxCards.map((card)=>(
      <div>{card.img}<p>{card.name}</p></div>
    ))}</div>
  )
}

export default HorizontParallax