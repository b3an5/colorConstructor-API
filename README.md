# colorConstructor-API

## Base URL -https://colorconstructor-api.herokuapp.com/

## Endpoints

### GET '/api/v1/projects'
* gives back a list of all projects in JSON

``` 
[
    {
        "id": 2,
        "name": "testfeproj",
        "created_at": "2019-07-10T04:49:38.653Z",
        "updated_at": "2019-07-10T04:49:38.653Z"
    },
    {
        "id": 4,
        "name": "Matt",
        "created_at": "2019-07-10T18:14:23.280Z",
        "updated_at": "2019-07-10T18:14:23.280Z"
    },
    {
        "id": 25,
        "name": "bowie",
        "created_at": "2019-07-10T20:59:43.340Z",
        "updated_at": "2019-07-10T20:59:43.340Z"
    }
]
```

### GET '/api/v1/palettes'
* gives back a list of all the palettes in JSON

``` 
[
    {
        "id": 3,
        "name": "test fe pal",
        "color_1": "#64807d",
        "color_2": "#778187",
        "color_3": "#75621e",
        "color_4": "#209bac",
        "color_5": "#0388ba",
        "project_id": 2,
        "created_at": "2019-07-10T04:49:40.102Z",
        "updated_at": "2019-07-10T04:49:40.102Z"
    },
    {
        "id": 33,
        "name": "kmmv",
        "color_1": "#d8aaeb",
        "color_2": "#08ea78",
        "color_3": "#3167fb",
        "color_4": "#acb23b",
        "color_5": "#783627",
        "project_id": 4,
        "created_at": "2019-07-10T20:27:09.888Z",
        "updated_at": "2019-07-10T20:27:09.888Z"
    },
    {
        "id": 37,
        "name": "lola",
        "color_1": "#6546f7",
        "color_2": "#ef845c",
        "color_3": "#b18500",
        "color_4": "#c8ba9b",
        "color_5": "#cf770f",
        "project_id": 25,
        "created_at": "2019-07-10T20:59:43.806Z",
        "updated_at": "2019-07-10T20:59:43.806Z"
    }
]
```

### GET '/api/v1/projects/:id'
* gives back a specific project in JSON

``` 
{
   "id": 2,
   "name": "testfeproj",
   "created_at": "2019-07-10T04:49:38.653Z",
   "updated_at": "2019-07-10T04:49:38.653Z"
 }
```


### GET '/api/v1/palettes/:id'
* gives back a specific palette in JSON

``` 
{
        "id": 33,
        "name": "kmmv",
        "color_1": "#d8aaeb",
        "color_2": "#08ea78",
        "color_3": "#3167fb",
        "color_4": "#acb23b",
        "color_5": "#783627",
        "project_id": 4,
        "created_at": "2019-07-10T20:27:09.888Z",
        "updated_at": "2019-07-10T20:27:09.888Z"
}
```

### POST '/api/v1/projects'
* Allows user to post new projects to the database
#### Required Request body
* name 


### POST '/api/v1/palettes'
* Allows user to post new palettes to the database
#### Required Request body
* name 
* color_1
* color_2
* color_3
* color_4
* color_5
* project_id

### DELETE '/api/v1/palettes/:id'
* Allows user to delete palettes from the database
#### URL params
* palettes_id
* all corresponding palettes must be deleted before the project

### DELETE '/api/v1/projects/:id'
* Allows user to delete projects from the database
#### URL params
* project_id
* all corresponding palettes must be deleted before the project
