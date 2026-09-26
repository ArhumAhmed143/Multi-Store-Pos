&lt;?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'manager_id',
    ];

    /**
     * Get the manager (user) for this store.
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get all products in this store.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
