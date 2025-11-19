<?php
// router.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($uri === '/about') {
    require 'about.html';
    return;
}

if ($uri === '/') {
    require 'index.html';
    return;
}

if ($uri === '/all-projects') {
    require 'all-projects.html';
    return;
}

// Allow pretty project URLs: /project/{project-id}
if ($uri === '/project') {
    // legacy /project route (expects ?project=...)
    require 'project.php';
    return;
}

// match /project/<slug> and route to project.php with $_GET['project'] set
if (preg_match('#^/project/([^/]+)/?$#', $uri, $m)) {
    // set the expected GET param and include the project renderer
    $_GET['project'] = $m[1];
    require 'project.php';
    return;
}

if ($uri === '/contact') {
    require 'contact.html';
    return;
}

if ($uri === '/privacy-policy') {
    require 'privacy-policy.html';
    return;
}

if ($uri === '/terms-and-conditions') {
    require 'terms-and-conditions.html';
    return;
}

// Serve static files or default handler
if (file_exists(__DIR__ . $uri)) {
    return false; // serve the requested resource as-is
}

// Fallback: show 404
http_response_code(404);
echo '404 Not Found';