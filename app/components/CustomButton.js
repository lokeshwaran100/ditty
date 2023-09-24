const CustomButton = ({type,handleClick,name,styles}) => {
    return (
      <button type={type} className={styles} onClick={handleClick}>
      {name}
      </button>
    )
  }
  
  export default CustomButton