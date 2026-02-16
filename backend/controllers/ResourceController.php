<?php

class ResourceController
{
    public static function index(array $params): void
    {
        $result = Resource::getAll([
            'page' => Validator::getPage(),
            'limit' => Validator::getLimit(),
            'sort' => Validator::getQueryParam('sort', 'popular'),
            'category' => Validator::getQueryParam('category'),
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

    public static function search(array $params): void
    {
        $query = Validator::getQueryParam('q', '');
        if (strlen($query) < 2) {
            Response::error('Search query must be at least 2 characters', 422);
        }

        $result = Resource::search($query, [
            'page' => Validator::getPage(),
            'limit' => Validator::getLimit(),
        ]);

        Response::paginated(
            $result['data'],
            $result['total'],
            $result['page'],
            $result['limit']
        );
    }

    public static function show(array $params): void
    {
        $slug = $params['slug'] ?? '';
        $resource = Resource::findBySlug($slug);

        if (!$resource) {
            Response::error('Resource not found', 404);
        }

        Response::success($resource);
    }

    public static function related(array $params): void
    {
        $slug = $params['slug'] ?? '';
        $limit = (int)Validator::getQueryParam('limit', 5);
        $related = Resource::getRelated($slug, $limit);

        Response::success($related);
    }

    public static function sitemap(array $params): void
    {
        header('Content-Type: application/xml; charset=utf-8');

        $resources = Resource::getAllSlugs();
        $baseUrl = APP_URL;

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Homepage
        $xml .= "<url><loc>$baseUrl/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n";

        // Resources
        foreach ($resources as $r) {
            $xml .= "<url><loc>$baseUrl/resource/{$r['slug']}</loc>";
            $xml .= "<lastmod>" . date('Y-m-d', strtotime($r['updated_at'])) . "</lastmod>";
            $xml .= "<changefreq>weekly</changefreq><priority>0.8</priority></url>\n";
        }

        $xml .= "</urlset>";
        echo $xml;
        exit;
    }
}
