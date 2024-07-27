import validator from 'express-validator'
import { fetchRecipe, createRecipe, fetchRecipes, removeRecipe } from "../controllers/recipe"
import Recipe from "../models/recipe"


jest.mock('express-validator', ()=>({
    validationResult: jest.fn(()=>({
        isEmpty: jest.fn(()=>false),
        array: jest.fn(()=>[{msg: "Field is required"}])
    }))
}))


jest.mock('../models/recipe');

describe("get recipe", ()=>{
    const req = {
        URLSearchParams: {
          id: "66a14946c4413e6b2bd25552",
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

   it('should get a recipe', async()=>{

    await fetchRecipe(req,res)

    expect(res.send).toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledTimes(1)
   }) 

   it('should call status 404 when recipe not found', async()=>{
    const copyReq = {...req, recipeId:"66a14946c4413e6b2bd25552ddd"}

    await fetchRecipe(copyReq,res)

    expect(res.status).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledTimes(1)

   })
})


describe('get recipes', ()=>{
    const req = {
        URLSearchParams: {
          page: "1",
          limit: "3"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

    it('should get a recipes', async()=>{

        await fetchRecipes(req,res)
    
        expect(res.status).toHaveBeenCalled()
       }) 
})




describe('create recipe',()=>{
    
    it('should call status 400 when there are errors', async()=>{
        const req = {
            body: {
             title: "",
             ingredients:"",
             instructions:""
            }
         }
     
         const res = {
             status: jest.fn().mockReturnValue({
                 json: jest.fn()
             }),
             json: jest.fn()
         };
        await createRecipe(req, res);
        expect(validator.validationResult).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status().json).toHaveBeenCalledWith([{ msg: 'Field is required' }]);
    })

    it('should return status 201', async()=>{
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(()=>({
            isEmpty: jest.fn(()=>true)
        }))

         const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        const req = {
           body: {
             title: "Afam soup",
             ingredients:"okazi, water leaf, meat, fish",
             instructions:"steam the fish, meat and other stocks for few minutes",
             imageUrl: null
            }
         }

        Recipe.create.mockResolvedValue(req.body);

        const saveMethod = jest.spyOn(Recipe.prototype, "save")

        await createRecipe(req, res)

        expect(validator.validationResult).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(Recipe).toHaveBeenCalled()
        expect(Recipe).toHaveBeenCalledWith(req.body)
        expect(saveMethod).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should call status 404 when not saved', async()=>{
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(()=>({
            isEmpty: jest.fn(()=>true)
        }))

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        const req = {
           body: {
             title: "Afam soup",
             ingredients:"okazi, water leaf, meat, fish",
             instructions:"steam the fish, meat and other stocks for few minutes",
             imageUrl: null
            }
         }

        const saveMethod = jest.spyOn(Recipe.prototype, "save").mockImplementationOnce(()=> Promise.reject('Failed to save recipe'))

        await createRecipe(req, res)

        expect(saveMethod).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(404)
    })

})

describe('delete recipe', ()=>{

    const req = {
        param: {
          id: "66a14946c4413e6b2bd25552",
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }


    it('should get a recipe', async()=>{

        await removeRecipe(req,res) 
        expect(res.send).toHaveBeenCalled()
       }) 
})


