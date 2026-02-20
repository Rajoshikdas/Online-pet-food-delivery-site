import Pet from '../models/Pet.js'

export const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()
    res.json(pets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, birthday, gender, neutered, weight, dietaryNotes, image } = req.body

    const neuteredVal = neutered === 'yes' || neutered === true
      ? true
      : neutered === 'no' || neutered === false
        ? false
        : null

    const pet = await Pet.create({
      user: req.user._id,
      name,
      species,
      breed: breed || '',
      age: age || '',
      birthday: birthday ? new Date(birthday) : null,
      gender: gender || '',
      neutered: neuteredVal,
      weight: weight || '',
      dietaryNotes: dietaryNotes || '',
      image: image || '',
    })
    res.status(201).json(pet)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, birthday, gender, neutered, weight, dietaryNotes, image } = req.body
    const update = {}

    if (name != null) update.name = name
    if (species != null) update.species = species
    if (breed != null) update.breed = breed
    if (age != null) update.age = age
    if (birthday !== undefined) update.birthday = birthday ? new Date(birthday) : null
    if (gender != null) update.gender = gender
    if (neutered != null) {
      update.neutered = neutered === 'yes' || neutered === true
        ? true
        : neutered === 'no' || neutered === false
          ? false
          : null
    }
    if (weight != null) update.weight = weight
    if (dietaryNotes != null) update.dietaryNotes = dietaryNotes
    if (image != null) update.image = image

    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    )
    if (!pet) return res.status(404).json({ message: 'Pet not found' })
    res.json(pet)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!pet) return res.status(404).json({ message: 'Pet not found' })
    res.json({ message: 'Pet removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
