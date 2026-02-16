<?php

class CategoryController
{
    public static function index(array $params): void
    {
        $categories = Category::getAll();
        Response::success($categories);
    }

    public static function resources(array $params): void
    {
        $slug = $params['slug'] ?? '';

        $result = Category::getResources($slug, [
            'page' => Validator::getPage(),
            'limit' => Validator::getLimit(),
            'sort' => Validator::getQueryParam('sort', 'popular'),
            'price' => Validator::getQueryParam('price'),
            'tags' => Validator::getQueryParam('tags'),
        ]);

        Response::paginated(
            $result['data'],
            $result['total'],
            $result['page'],
            $result['limit']
        );
    }
}
