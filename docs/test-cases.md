# Test Cases

## Public Request Form
1. Product with only `allow_quantity` true shows only quantity input.
2. Product with all toggles true shows quantity, size, material, color/design, and notes.
3. Invalid email is rejected on submit.
4. Submission success redirects to `/request/confirmation` and includes request id.

## API Validation
1. Posting disabled fields to `POST /api/requests` returns `400`.
2. Posting invalid option values returns `400`.
3. Product not found or inactive returns `404`.
4. Exceeding rate limit returns `429`.

## Admin
1. Unauthenticated user visiting `/admin` is redirected to `/admin/login`.
2. Admin can create category and product.
3. Admin can archive and reactivate category/product.
4. Admin can update request status from `new` to any allowed state.
