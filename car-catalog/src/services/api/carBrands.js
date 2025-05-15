// Función para obtener una imagen predeterminada por marca
export const getDefaultCarImage = (make) => {
  const brandImages = {
    'toyota': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'ford': 'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'bmw': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'nissan': 'https://images.unsplash.com/photo-1590510575339-2aff0bb14ba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'volkswagen': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'subaru': 'https://images.unsplash.com/photo-1626668893654-6288548dd7b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mazda': 'https://images.unsplash.com/photo-1586464836139-86553c751f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'hyundai': 'https://images.unsplash.com/photo-1629293363663-08de80df7b5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'kia': 'https://images.unsplash.com/photo-1558383817-dd10c33e799f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'lexus': 'https://images.unsplash.com/photo-1622194993874-8d835e7022e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'porsche': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
  };

  // Obtener la marca en minúsculas para buscar
  const makeLower = make ? make.toLowerCase() : '';
  
  // Buscar la marca en nuestro objeto de imágenes
  if (brandImages[makeLower]) {
    return brandImages[makeLower];
  }
  
  // Si no encontramos la marca, devolver una imagen genérica
  return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80';
};

// Catálogo ampliado de imágenes por marca y modelo para DuckDuckGo
export const carModelImages = {
  // Toyota
  'toyota': {
    'corolla': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-toyota-corolla-sedan.jpg',
    'camry': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-toyota-camry-trd-first-drive.jpg',
    'rav4': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2019-toyota-rav4-adventure-first-drive.jpg',
    'highlander': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-toyota-highlander-platinum-exterior.jpg',
    'tacoma': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2020-toyota-tacoma-trd-pro-drivers-notes.jpg',
    'tundra': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2022-toyota-tundra-platinum.jpg',
    'gr 86': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2022-toyota-gr-86.jpg',
    'supra': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-toyota-supra.jpg',
    'default': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-toyota-corolla-sedan.jpg'
  },
  // ...resto de marcas
  // (incluye el resto del catálogo tal como está en tu código original)

  // Valor predeterminado para cualquier marca que no tengamos
  'default': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80'
};