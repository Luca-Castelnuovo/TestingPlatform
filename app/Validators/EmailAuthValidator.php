<?php

namespace App\Validators;

use Respect\Validation\Validator as v;

class EmailAuthValidator extends ValidatorBase
{
    /**
     * Validate json submission
     *
     * @param object $data
     *
     * @return void
     */
    public static function request($data)
    {
        $v = v::attribute('email', v::email()->length(1, 255));

        ValidatorBase::validate($v, $data);
    }
}
